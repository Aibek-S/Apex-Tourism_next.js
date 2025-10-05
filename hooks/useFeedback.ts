import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

interface Feedback {
  id: number;
  place_id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  users?: {
    full_name: string;
  };
}

interface FeedbackData {
  userId: string;
  rating: number;
  comment: string;
}

interface RatingDistribution {
  [key: number]: number;
}

export function useFeedback(placeId: number | undefined) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("feedback")
        .select(`
          *,
          users (
            full_name
          )
        `)
        .eq("place_id", placeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setFeedback(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId) {
      fetchFeedback();
    }
  }, [placeId, fetchFeedback]);

  const addFeedback = async (feedbackData: FeedbackData) => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .insert({
          place_id: placeId,
          user_id: feedbackData.userId,
          rating: feedbackData.rating,
          comment: feedbackData.comment
        } as any)
        .select();

      if (error) throw error;
      
      // Refresh feedback list
      await fetchFeedback();
      
      return data[0];
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateFeedback = async (feedbackId: number, feedbackData: FeedbackData) => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .update({
          rating: feedbackData.rating,
          comment: feedbackData.comment,
          updated_at: new Date()
        })
        .eq("id", feedbackId)
        .eq("user_id", feedbackData.userId)
        .select();

      if (error) throw error;
      
      // Refresh feedback list
      await fetchFeedback();
      
      return data[0];
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteFeedback = async (feedbackId: number, userId: string) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", feedbackId)
        .eq("user_id", userId);

      if (error) throw error;
      
      // Refresh feedback list
      await fetchFeedback();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Calculate average rating
  const getAverageRating = (): number => {
    if (!feedback || feedback.length === 0) return 0;
    
    const sum = feedback.reduce((acc, item) => acc + item.rating, 0);
    return parseFloat((sum / feedback.length).toFixed(1));
  };

  // Get rating distribution
  const getRatingDistribution = (): RatingDistribution => {
    const distribution: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    feedback.forEach(item => {
      distribution[item.rating]++;
    });
    
    return distribution;
  };

  return {
    feedback,
    loading,
    error,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    getAverageRating,
    getRatingDistribution,
    refetch: fetchFeedback
  };
}