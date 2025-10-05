import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      const { data, error } = await supabase
        .from("categories")
        .select("id, name_ru, name_en, name_kz")
        .order("id");

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
}

export function usePlaces(categoryId: string | null = null) {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      let query = supabase
        .from("places")
        .select(`
          *,
          categories (
            id,
            name_ru,
            name_en,
            name_kz
          ),
          place_photos (
            id,
            url
          )
        `);

      if (categoryId) {
        // Convert categoryId to number to match database type
        const numericCategoryId = parseInt(categoryId, 10);
        if (!isNaN(numericCategoryId)) {
          query = query.eq("category_id", numericCategoryId);
        }
      }

      const { data, error } = await query.order("id");

      if (error) throw error;
      
      // Limit to first photo only for list views
      const placesWithLimitedPhotos = data.map((place: any) => {
        if (place.place_photos && Array.isArray(place.place_photos)) {
          return {
            ...place,
            place_photos: place.place_photos.slice(0, 1) // Only first photo for performance
          };
        }
        return place;
      });
      
      setPlaces(placesWithLimitedPhotos || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return { places, loading, error, refetch: fetchPlaces };
}

export function usePlace(placeId: string | undefined) {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlace = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      if (!placeId) {
        throw new Error("Invalid place ID");
      }

      // Convert placeId to number to match database type
      const numericPlaceId = parseInt(placeId, 10);
      if (isNaN(numericPlaceId)) {
        throw new Error("Invalid place ID");
      }

      // Fetch place data with photos
      const { data, error } = await supabase
        .from("places")
        .select(
          `
          id,
          name_ru,
          name_en,
          name_kz,
          description_ru,
          description_en,
          description_kz,
          legends_ru,
          legends_en,
          legends_kz,
          lat,
          lng,
          category_id,
          inmap_url,
          categories (
            id,
            name_ru,
            name_en,
            name_kz
          ),
          place_photos (
            id,
            url
          )
        `
        )
        .eq("id", numericPlaceId)
        .single();

      if (error) throw error;
      
      setPlace(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching place:", err);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId) {
      fetchPlace();
    } else {
      setPlace(null);
      setLoading(false);
    }
  }, [placeId, fetchPlace]);

  return { place, loading, error, refetch: fetchPlace };
}

// Helper function to construct image URL - images stored directly in images/ folder
export function getImageUrl(image: string) {
  if (!image) return null;
  
  // Check if NEXT_PUBLIC_SUPABASE_URL is set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not set in .env file");
    return null;
  }
  
  return `${supabaseUrl}/storage/v1/object/public/images/${image}`;
}

// Optimized hook for map - fetch only required fields
export function useMapPlaces() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMapPlaces();
  }, []);

  const fetchMapPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      const { data, error } = await supabase
        .from("places")
        .select(`
          id,
          name_ru,
          name_en,
          name_kz,
          lat,
          lng,
          category_id,
          categories (
            id,
            name_ru,
            name_en,
            name_kz
          ),
          place_photos (
            id,
            url
          )
        `)
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .order('id');

      if (error) throw error;
      
      // Limit to first photo only for map views
      const placesWithLimitedPhotos = data.map((place: any) => {
        if (place.place_photos && Array.isArray(place.place_photos)) {
          return {
            ...place,
            place_photos: place.place_photos.slice(0, 1) // Only first photo for performance
          };
        }
        return place;
      });
      
      setPlaces(placesWithLimitedPhotos || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching map places:", err);
    } finally {
      setLoading(false);
    }
  };

  return { places, loading, error, refetch: fetchMapPlaces };
}

// Hook to fetch all tours
export function useTours() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      // Fetch tours with associated places and tour photos, ordered by position
      const { data, error } = await supabase
        .from("tours")
        .select(`
          id,
          name,
          company,
          price,
          description,
          instagram_url,
          tour_places (
            position,
            places (
              id,
              name_ru,
              name_en,
              name_kz,
              place_photos (
                id,
                url
              )
            )
          ),
          tour_photos (
            id,
            url,
            is_logo,
            position
          )
        `)
        .order("id");

      if (error) throw error;
      
      // Sort places within each tour by position
      const toursWithSortedPlaces = data.map((tour: any) => {
        if (tour.tour_places) {
          // Sort tour_places by position
          tour.tour_places.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        }
        
        // Sort tour photos by position
        if (tour.tour_photos) {
          tour.tour_photos.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        }
        
        return tour;
      });
      
      setTours(toursWithSortedPlaces || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching tours:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return { tours, loading, error, refetch: fetchTours };
}

// Hook to fetch a single tour by ID
export function useTour(tourId: string | undefined) {
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTour = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      if (!tourId) {
        throw new Error("Invalid tour ID");
      }

      // Convert tourId to number to match database type
      const numericTourId = parseInt(tourId, 10);
      if (isNaN(numericTourId)) {
        throw new Error("Invalid tour ID");
      }

      // Fetch tour data with associated places and tour photos, ordered by position
      const { data, error } = await supabase
        .from("tours")
        .select(`
          id,
          name,
          company,
          price,
          description,
          instagram_url,
          tour_places (
            position,
            places (
              id,
              name_ru,
              name_en,
              name_kz,
              description_ru,
              description_en,
              description_kz,
              legends_ru,
              legends_en,
              legends_kz,
              place_photos (
                id,
                url
              )
            )
          ),
          tour_photos (
            id,
            url,
            is_logo,
            position
          )
        `)
        .eq("id", numericTourId)
        .single();

      if (error) throw error;
      
      // Sort places by position
      if (data && data.tour_places) {
        data.tour_places.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
      }
      
      // Sort tour photos by position
      if (data && data.tour_photos) {
        data.tour_photos.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
      }
      
      setTour(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching tour:", err);
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  useEffect(() => {
    if (tourId) {
      fetchTour();
    } else {
      setTour(null);
      setLoading(false);
    }
  }, [tourId, fetchTour]);

  return { tour, loading, error, refetch: fetchTour };
}

// Hook to fetch tours for a specific place
export function useToursByPlace(placeId: string | undefined) {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToursByPlace = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      if (!placeId) {
        throw new Error("Invalid place ID");
      }

      // Convert placeId to number to match database type
      const numericPlaceId = parseInt(placeId, 10);
      if (isNaN(numericPlaceId)) {
        throw new Error("Invalid place ID");
      }

      // Fetch tours that include this place
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          tour_places (
            position,
            place_id
          )
        `)
        .eq("tour_places.place_id", numericPlaceId);
      
      // Additional check to ensure we only return tours that actually have the place
      // This handles cases where the join might return unexpected results
      const filteredData = data ? data.filter((tour: any) => 
        tour.tour_places && tour.tour_places.some((tp: any) => tp.place_id === numericPlaceId)
      ) : [];

      if (error) throw error;
      
      setTours(filteredData || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching tours for place:", err);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId) {
      fetchToursByPlace();
    } else {
      setTours([]);
      setLoading(false);
    }
  }, [placeId, fetchToursByPlace]);

  return { tours, loading, error, refetch: fetchToursByPlace };
}

// Hook to fetch company data with logo
export function useCompany(companyName: string | undefined) {
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if supabase client is properly configured
      if (!supabase) {
        throw new Error("Supabase client is not properly configured. Check your .env file.");
      }

      if (!companyName) {
        throw new Error("Invalid company name");
      }

      // Fetch tours that belong to this company to get the logo
      const { data, error } = await supabase
        .from("tours")
        .select(`
          company,
          tour_photos (
            id,
            url,
            is_logo
          )
        `)
        .eq("company", companyName)
        .limit(1);

      if (error) throw error;

      // Extract logo if exists
      let logoUrl = null;
      if (data && data.length > 0 && data[0].tour_photos) {
        const logo = data[0].tour_photos.find((photo: any) => photo.is_logo);
        if (logo) {
          logoUrl = logo.url;
        }
      }

      // Create company data object
      const companyInfo = {
        name: companyName,
        logoUrl: logoUrl
      };

      setCompanyData(companyInfo);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching company data:", err);
    } finally {
      setLoading(false);
    }
  }, [companyName]);

  useEffect(() => {
    if (companyName) {
      fetchCompanyData();
    } else {
      setCompanyData(null);
      setLoading(false);
    }
  }, [companyName, fetchCompanyData]);

  return { companyData, loading, error, refetch: fetchCompanyData };
}