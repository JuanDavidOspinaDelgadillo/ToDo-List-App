import { gql } from "@apollo/client";

const CREATE_TASK_MUTATION = gql`
        mutation CreateTask($tittle: String!, $description: String!, $state: String!, $difficulty: numeric!, $userId: Int!, $createdAt: timestamptz!, $updatedAt: timestamptz!, $imageUrl: String!) {
            insert_tasks_one(object: {
                tittle: $tittle,
                description: $description,
                state: $state,
                difficulty: $difficulty,
                user_id: $userId,
                created_at: $createdAt,
                updated_at: $updatedAt,
                image_url: $imageUrl
            }) {
                id
                tittle
                description
                state
                difficulty
                created_at
                updated_at
                user_id
            }
        }
    `;

    const UPDATE_TASK = gql`
        mutation UpdateTask($id: Int!, $state: String!, $description: String!, $updatedAt: timestamptz!, $imageUrl: String!) {
            update_tasks_by_pk(pk_columns: { id: $id }, _set: { state: $state, description: $description, updated_at: $updatedAt, image_url: $imageUrl }) {
                id
                updated_at
            }
        }
    `;

    const GET_TASK_BY_ID = gql`
        query GetTaskById($id: Int!) {
            tasks_by_pk(id: $id) {
                tittle    
                description
                state
                difficulty
                image_url
            }
        }
    `;

export { GET_TASK_BY_ID, CREATE_TASK_MUTATION, UPDATE_TASK };