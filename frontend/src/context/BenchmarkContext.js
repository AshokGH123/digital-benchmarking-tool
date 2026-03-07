import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { benchmarkService } from '../services/benchmark';

const BenchmarkContext = createContext({});

const normalizeErrorMessage = (error, fallbackMessage) => {
  if (!error) return fallbackMessage;
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return fallbackMessage;
};

export const BenchmarkProvider = ({ children }) => {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'token' && !event.newValue) {
        setBenchmarks([]);
        setError(null);
        setLoading(false);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchBenchmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await benchmarkService.getBenchmarks();
      setBenchmarks(response.data || []);
      return response.data || [];
    } catch (err) {
      const message = normalizeErrorMessage(err, 'Failed to load benchmarks');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBenchmark = useCallback(async (payload) => {
    try {
      setError(null);
      const response = await benchmarkService.createBenchmark(payload);
      setBenchmarks((prev) => [response.data, ...prev]);
      toast.success('Benchmark created');
      return response.data;
    } catch (err) {
      const message = normalizeErrorMessage(err, 'Failed to create benchmark');
      setError(message);
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  const updateBenchmark = useCallback(async (id, payload) => {
    try {
      setError(null);
      const response = await benchmarkService.updateBenchmark(id, payload);
      setBenchmarks((prev) => prev.map((item) => (item.id === id ? response.data : item)));
      toast.success('Benchmark updated');
      return response.data;
    } catch (err) {
      const message = normalizeErrorMessage(err, 'Failed to update benchmark');
      setError(message);
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  const deleteBenchmark = useCallback(async (id) => {
    try {
      setError(null);
      await benchmarkService.deleteBenchmark(id);
      setBenchmarks((prev) => prev.filter((item) => item.id !== id));
      toast.success('Benchmark deleted');
    } catch (err) {
      const message = normalizeErrorMessage(err, 'Failed to delete benchmark');
      setError(message);
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  const value = useMemo(
    () => ({
      benchmarks,
      loading,
      error,
      fetchBenchmarks,
      createBenchmark,
      updateBenchmark,
      deleteBenchmark,
    }),
    [benchmarks, loading, error, fetchBenchmarks, createBenchmark, updateBenchmark, deleteBenchmark]
  );

  return <BenchmarkContext.Provider value={value}>{children}</BenchmarkContext.Provider>;
};

export const useBenchmarks = () => useContext(BenchmarkContext);
