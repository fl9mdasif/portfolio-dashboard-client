import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createReview: build.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.reviews],
    }),

    getAllReviews: build.query({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
      providesTags: [tagTypes.reviews],
    }),

    updateReview: build.mutation({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.reviews],
    }),

    deleteReview: build.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.reviews],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
