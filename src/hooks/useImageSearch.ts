import { useCallback, useEffect, useRef, useState } from 'react';
import type { CommonsImage } from '../types/image';
import type { LicenseFilters } from '../types/search';
import { CommonsApiError, searchCommons } from '../lib/commonsClient';
import { dedupeImages } from '../lib/dedupeImages';
import { filterImages } from '../lib/filterImages';
import { normalizeCommonsPage } from '../lib/normalizeCommons';
import { resolveEquivalentQuery } from '../lib/queryResolver';
import { addRecentSearch } from '../lib/storage';

export interface ImageSearchState {
  query: string;
  images: CommonsImage[];
  loading: boolean;
  error: 'network' | 'api' | null;
  searched: boolean;
}

const initialState: ImageSearchState = {
  query: '',
  images: [],
  loading: false,
  error: null,
  searched: false,
};

export function useImageSearch(filters: LicenseFilters) {
  const [state, setState] = useState<ImageSearchState>(initialState);
  const controllerRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef('');
  const rawImagesRef = useRef<CommonsImage[]>([]);

  useEffect(() => {
    setState((current) => ({ ...current, images: filterImages(rawImagesRef.current, filters) }));
  }, [filters]);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState((current) => ({ ...current, loading: false }));
  }, []);

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastQueryRef.current = trimmed;
    rawImagesRef.current = [];
    addRecentSearch(trimmed);
    setState({ query: trimmed, images: [], loading: true, error: null, searched: true });

    const equivalentPromise = resolveEquivalentQuery(trimmed, controller.signal);

    let primaryImages: CommonsImage[];
    try {
      const primaryPages = await searchCommons(trimmed, controller.signal);
      if (controller.signal.aborted) return;
      primaryImages = primaryPages.map(normalizeCommonsPage).filter((image): image is CommonsImage => image !== null);
      rawImagesRef.current = dedupeImages(primaryImages);
      setState((current) => ({
        ...current,
        images: filterImages(rawImagesRef.current, filters),
        error: null,
      }));
    } catch (error) {
      if (controller.signal.aborted) return;
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof CommonsApiError ? 'api' : 'network',
      }));
      return;
    }

    try {
      const resolved = await equivalentPromise;
      if (controller.signal.aborted) return;
      if (resolved.equivalent) {
        try {
          const equivalentPages = await searchCommons(resolved.equivalent, controller.signal);
          if (controller.signal.aborted) return;
          const equivalentImages = equivalentPages.map(normalizeCommonsPage).filter((image): image is CommonsImage => image !== null);
          rawImagesRef.current = dedupeImages([...primaryImages, ...equivalentImages]);
          setState((current) => ({
            ...current,
            images: filterImages(rawImagesRef.current, filters),
          }));
        } catch {
          if (controller.signal.aborted) return;
          // Keep successful primary results if the optional equivalent search fails.
        }
      }
    } catch {
      if (controller.signal.aborted) return;
      // Equivalent resolution is optional; primary results remain valid.
    } finally {
      if (!controller.signal.aborted) {
        setState((current) => ({ ...current, loading: false }));
      }
    }
  }, [filters]);

  const retry = useCallback(async () => {
    if (lastQueryRef.current) await search(lastQueryRef.current);
  }, [search]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { state, search, retry, cancel };
}
