import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const skillApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSkill: build.mutation({
      query: (data) => ({
        url: "/skills",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.skills],
    }),

    getAllSkills: build.query({
      query: () => ({
        url: "/skills",
        method: "GET",
      }),
      providesTags: [tagTypes.skills],
    }),

    updateSkill: build.mutation({
      query: ({ id, data }) => ({
        url: `/skills/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.skills],
    }),

    deleteSkill: build.mutation({
      query: (id) => ({
        url: `/skills/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.skills],
    }),
  }),
});

export const {
  useCreateSkillMutation,
  useGetAllSkillsQuery,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillApi;
