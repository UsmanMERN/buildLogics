import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { InferRequestType } from 'hono';

// Define types for request and response
type ResponseType = InferRequestType<(typeof client.api.users)['is-premium']['$get']>;
type RequestType = InferRequestType<(typeof client.api.users)['is-premium']['$get']>;

export const useCheckPremium = () => {
  const query = useQuery<ResponseType, Error, RequestType>({
    queryKey: ['isPremium'],
    queryFn: async () => {
      // Call the is-premium API endpoint
      const response = await client.api.users['is-premium']['$get']();
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      return data.isPremium;
    },
  });
  return query;
};

export const useFetchUserData = () => {
    return useQuery({
      queryKey: ["userData"],
      queryFn: async () => {
        const response = await client.api.users["user-data"]["$get"](); // Ensure this route exists
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        return data.user; // Assuming the backend returns `{ user: {...} }`
      },
    });
  };