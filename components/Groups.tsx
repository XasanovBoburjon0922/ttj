import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

interface Group {
    id: number;
    teacher: number;
    name: string;
    edu_form: string;
}

interface Employee {
    id: number;
    first_name: string;
    phone: string;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function CreateGroup() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [name, setName] = useState<string>('');
    const [teacher, setTeacher] = useState<number>(0);
    const [eduForm, setEduForm] = useState<string>('daytime');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchGroups();
        fetchEmployees();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('https://nbtuit.pythonanywhere.com/api/v1/common/group/create/');
            setGroups(response.data.results);
            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('https://nbtuit.pythonanywhere.com/api/v1/auth/employees/');
            setEmployees(response.data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const createGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://nbtuit.pythonanywhere.com/api/v1/common/group/create/', {
                name,
                teacher,
                edu_form: eduForm,
            });
            setGroups([...groups, response.data]);
            setName('');
            setTeacher(0);
            setEduForm('daytime');
            handleClose();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className='flex justify-end'>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Guruh yaratish
                </Button>
            </div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <h2>Guruh yaratish</h2>
                    <form onSubmit={createGroup}>
                        <TextField
                            label="Guruh nomi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="teacher-label">O'qituvchi</InputLabel>
                            <Select
                                labelId="teacher-label"
                                value={teacher}
                                onChange={(e) => setTeacher(Number(e.target.value))}
                                required
                            >
                                <MenuItem value={0} disabled>
                                    O'qituvchi tanlash
                                </MenuItem>
                                {employees.map((employee) => (
                                    <MenuItem key={employee.id} value={employee.id}>
                                        {employee.first_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="edu-form-label">Talaba shakli</InputLabel>
                            <Select
                                labelId="edu-form-label"
                                value={eduForm}
                                onChange={(e) => setEduForm(e.target.value)}
                                required
                            >
                                <MenuItem value="daytime">Kunduzgi</MenuItem>
                                <MenuItem value="evening">Kechki</MenuItem>
                                <MenuItem value="remote">Masofaviy</MenuItem>
                                <MenuItem value="correspondence">Sirtqi</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Guruh yaratish
                        </Button>
                    </form>
                </Box>
            </Modal>
            <h2 className='mb-4'>Guruhlar:</h2>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>
                        <strong>{group.name}</strong> (Xodim ID: {group.teacher}, Talim shakli: {group.edu_form})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CreateGroup;
