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
            }
        }
    `;

    const GET_TASKS_BY_DIFFICULTY = gql`
        query GetTasksByDifficulty($userId: Int!, $difficulty: numeric!) {
            tasks(where: { user_id: {_eq: $userId}, difficulty: {_eq: $difficulty} }) {
                id
                tittle
                description
                state
                difficulty
                created_at
                updated_at
            }
        }
    `;

    const GET_TASKS_BY_STATE = gql`
        query GetTasksByDifficulty($userId: Int!, $state: String!) {
            tasks(where: { user_id: {_eq: $userId}, state: {_eq: $state} }) {
                id
                tittle
                description
                state
                difficulty
                created_at
                updated_at
            }
        }
    `;

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

    const DELETE_TASK = gql`
        mutation DeleteTask($id: Int!) {
            delete_tasks_by_pk(id: $id) {
                id
            }
        }`;

export {GET_TASKS, 
        GET_TASKS_BY_DIFFICULTY, 
        GET_TASKS_BY_STATE, 
        CREATE_TASK_MUTATION, 
        UPDATE_TASK, 
        DELETE_TASK };