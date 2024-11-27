import { gql } from "@apollo/client";

const GET_TASKS = gql`
        query GetTasks($userId: Int!) {
            tasks(where: { user_id: {_eq: $userId} }) {
                id
                tittle
                description
                state
                difficulty
                created_at
                updated_at
                image_url
            }
        }
    `;

    const DELETE_TASK = gql`
        mutation DeleteTask($id: Int!) {
            delete_tasks_by_pk(id: $id) {
                id
            }
        }`;

export { GET_TASKS, DELETE_TASK };