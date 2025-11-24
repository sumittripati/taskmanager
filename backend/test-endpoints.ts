import axios from 'axios';

const API_URL = 'http://localhost:4000';
let accessToken = '';
let taskId = '';

const runTests = async () => {
    try {
        console.log('--- Starting Verification ---');

        // 1. Register
        console.log('\n1. Registering user...');
        try {
            await axios.post(`${API_URL}/auth/register`, {
                email: 'test@example.com',
                password: 'password123'
            });
            console.log('User registered.');
        } catch (e: any) {
            if (e.response?.status === 409) {
                console.log('User already exists, proceeding to login.');
            } else {
                throw e;
            }
        }

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        accessToken = loginRes.data.accessToken;
        console.log('Logged in. Token received.');

        // 3. Create Task
        console.log('\n3. Creating task...');
        const createRes = await axios.post(`${API_URL}/tasks`, {
            title: 'Test Task',
            description: 'This is a test task'
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        taskId = createRes.data.id;
        console.log('Task created:', createRes.data);

        // 4. List Tasks
        console.log('\n4. Listing tasks...');
        const listRes = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Tasks found:', listRes.data.tasks.length);

        // 5. Update Task
        console.log('\n5. Updating task...');
        const updateRes = await axios.patch(`${API_URL}/tasks/${taskId}`, {
            status: 'IN_PROGRESS'
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Task updated:', updateRes.data);

        // 6. Toggle Task
        console.log('\n6. Toggling task...');
        const toggleRes = await axios.patch(`${API_URL}/tasks/${taskId}/toggle`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Task toggled:', toggleRes.data);

        // 7. Delete Task
        console.log('\n7. Deleting task...');
        await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Task deleted.');

        console.log('\n--- Verification Complete ---');
    } catch (error: any) {
        console.error('Verification Failed:', error.response?.data || error.message);
    }
};

runTests();
