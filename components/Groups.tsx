import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    Modal,
    Box,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
            const response = await axios.get('https://nbtuit.pythonanywhere.com/api/v1/users/employees/');
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
        return <div>{t('Loading...')}</div>;
    }

    if (error) {
        return <div>{t('Error')}: {error}</div>;
    }

    return (
        <div>
            <div className='flex justify-end'>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    {t('Create Group')}
                </Button>
            </div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <h2>{t('Create Group')}</h2>
                    <form onSubmit={createGroup}>
                        <TextField
                            label={t("Group Name")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="teacher-label">{t("Teacher")}</InputLabel>
                            <Select
                                labelId="teacher-label"
                                value={teacher}
                                onChange={(e) => setTeacher(Number(e.target.value))}
                                required
                            >
                                <MenuItem value={0} disabled>
                                    {t('Select a Teacher')}
                                </MenuItem>
                                {employees.map((employee) => (
                                    <MenuItem key={employee.id} value={employee.id}>
                                        {employee.first_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="edu-form-label">{t("Education Form")}</InputLabel>
                            <Select
                                labelId="edu-form-label"
                                value={eduForm}
                                onChange={(e) => setEduForm(e.target.value)}
                                required
                            >
                                <MenuItem value="daytime">{t('Daytime')}</MenuItem>
                                <MenuItem value="evening">{t('Evening')}</MenuItem>
                                <MenuItem value="remote">{t('Remote')}</MenuItem>
                                <MenuItem value="correspondence">{t('Correspondence')}</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            {t('Create Group')}
                        </Button>
                    </form>
                </Box>
            </Modal>

            <h2 className='my-[20px]'>{t('Groups')}</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>{t('Group Name')}</strong></TableCell>
                            <TableCell><strong>{t('Teacher')}</strong></TableCell>
                            <TableCell><strong>{t('Education Form')}</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groups.map((group) => (
                            <TableRow key={group.id}>
                                <TableCell>{group.name}</TableCell>
                                <TableCell>{employees.find((employee) => employee.id === group.teacher)?.first_name}</TableCell>
                                <TableCell>
                                    {group.edu_form === 'daytime' ? t('Daytime') :
                                        group.edu_form === 'evening' ? t('Evening') :
                                            group.edu_form === 'remote' ? t('Remote') :
                                                group.edu_form === 'correspondence' ? t('Correspondence') :
                                                    ''}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default CreateGroup;
