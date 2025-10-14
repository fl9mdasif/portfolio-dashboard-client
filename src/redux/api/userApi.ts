// // import { tagTypes } from "../tag-types";
// import { tagTypes } from "../tag-types";
// import { baseApi } from "./baseApi";

// const UserApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     changePassword: build.mutation({
//       query: (data) => ({
//         url: "/auth/change-password",
//         method: "POST",
//         contentType: "application/json",
//         data,
//       }),
//       invalidatesTags: [tagTypes.user],
//     }),

//     updateUser: build.mutation({
//       query: (data) => ({
//         url: `/profile`,
//         method: "PATCH",
//         data,
//       }),
//       invalidatesTags: [tagTypes.user],
//     }),

//     getMyProfile: build.query({
//       query: () => ({
//         url: "/profile/me",
//         method: "GET",
//       }),
//       providesTags: [tagTypes.user],
//     }),

//     getAllUsers: build.query({
//       query: () => ({
//         url: "/profile/get-all",
//         method: "GET",
//       }),
//       providesTags: [tagTypes.user],
//     }),

//     deleteUserFromDB: build.mutation({
//       query: (id) => ({
//         url: `/profile/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: [tagTypes.user],
//     }),

//     updateUserByAdmin: build.mutation({
//       query: ({ id, data }) => ({
//         url: `/profile/${id}`,
//         method: "PATCH",
//         data,
//       }),
//       invalidatesTags: [tagTypes.user],
//     }),

//     getMyAdoptions: build.query({
//       query: () => ({
//         url: `/profile/my-adoptions`,
//         method: "GET",
//       }),
//     }),
//   }),
// });

// export const {
//   useUpdateUserMutation,
//   useChangePasswordMutation,
//   useGetMyProfileQuery,
//   useGetAllUsersQuery,
//   useDeleteUserFromDBMutation,
//   useUpdateUserByAdminMutation,
//   useGetMyAdoptionsQuery,
// } = UserApi;
