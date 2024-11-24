import { gql } from "@apollo/client";

const CREATE_TASK_MUTATION = gql`
        mutation CreateTask($tittle: String!, $description: String!, $state: String!, $difficulty: smallint!, $userId: Int!, $createdAt: timestamptz!, $updatedAt: timestamptz!) {
            insert_tasks_one(object: {
                tittle: $tittle,
                description: $description,
                state: $state,
                difficulty: $difficulty,
                user_id: $userId,
                created_at: $createdAt,
                updated_at: $updatedAt
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
        }`;

    const UPDATE_TASK = gql`
        mutation UpdateTask($id: Int!, $state: String!, $description: String!, $updatedAt: timestamptz!) {
            update_tasks_by_pk(pk_columns: { id: $id }, _set: { state: $state, description: $description, updated_at: $updatedAt }) {
                id
                tittle
                state
                description
                updated_at
            }
        }`;

export { CREATE_TASK_MUTATION, UPDATE_TASK };