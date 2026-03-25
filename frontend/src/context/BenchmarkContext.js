import React, { createContext, useState, useContext, useCallback } from 'react';
import { benchmarkService } from '../services/benchmark';
import toast from 'react-hot-toast';

const BenchmarkContext = createContext();

export const useBenchmarks = () => useContext(BenchmarkContext);

export const BenchmarkProvider = ({ children }) => {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBenchmarks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await benchmarkService.getBenchmarks();
      setBenchmarks(response.data || []);
      return response.data || [];
    } catch (error) {
      toast.error(error.message || 'Failed to fetch benchmarks');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createBenchmark = async (data) => {
    try {
      const response = await benchmarkService.createBenchmark(data);
      setBenchmarks(prev => [response.data, ...prev]);
      toast.success('Benchmark created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to create benchmark');
      throw error;
    }
  };

  const updateBenchmark = async (id, data) => {
    try {
      const response = await benchmarkService.updateBenchmark(id, data);
      setBenchmarks(prev => prev.map(b => b.id === id ? response.data : b));
      toast.success('Benchmark updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update benchmark');
      throw error;
    }
  };

  const deleteBenchmark = async (id) => {
    try {
      await benchmarkService.deleteBenchmark(id);
      setBenchmarks(prev => prev.filter(b => b.id !== id));
      toast.success('Benchmark deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete benchmark');
      throw error;
    }
  };

  const value = {
    benchmarks,
    loading,
    fetchBenchmarks,
    createBenchmark,
    updateBenchmark,
    deleteBenchmark,
  };

  return (
    <BenchmarkContext.Provider value={value}>
      {children}
    </BenchmarkContext.Provider>
  );
};
