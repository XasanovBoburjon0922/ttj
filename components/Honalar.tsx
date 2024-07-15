import React, { useState, useEffect } from 'react';
import { Box, Breadcrumbs, Link, Card, CardContent, Typography, Button, Modal, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { CheckOutlined, CloseOutlined, LeftOutlined, LockOutlined, RightOutlined, UnlockOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Props {
    students: any[];
    setStudents: React.Dispatch<React.SetStateAction<any[]>>;
}
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const Attendance: React.FC<Props> = ({ students, setStudents }) => {
    const [selectedFloor, setSelectedFloor] = useState<any | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
    const [attendance, setAttendance] = useState<any>({});
    const [floors, setFloors] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

    const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
    const [addTalabaRoomModalOpen, setAddTalabaRoomModalOpen] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [apartment, setApartment] = useState('');
    const [group, setGroup] = useState<any | any[]>([]); // Assuming the group structure matches your needs
    const [selectedGroup, setSelectedGroup] = useState(''); // State for selected group

    console.log(group);
    console.log(students);




    const [addStudentRoomModalOpen, setAddStudentRoomModalOpen] = useState(false);
    const [selectedFloorForApartment, setSelectedFloorForApartment] = useState('');
    const [roomsForApartment, setRoomsForApartment] = useState<any[]>([]);

    const [attendanceIdMap, setAttendanceIdMap] = useState<any>({});
    useEffect(() => {
        axios.get('https://nbtuit.pythonanywhere.com/api/v1/common/floor-list/')
            .then(response => {
                setFloors(response.data);
            })
            .catch(error => {
                console.error('Error fetching floors:', error);
            });

        const savedAttendance = localStorage.getItem('attendance');
        if (savedAttendance) {
            setAttendance(JSON.parse(savedAttendance));
        }
    }, []);

    useEffect(() => {
        axios.get('http://nbtuit.pythonanywhere.com/api/v1/common/group/list/')
            .then(response => {
                setGroup(response.data.results); // Assuming response.data is an array of groups
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);
    useEffect(() => {
        if (selectedFloor) {
            axios.get(`https://nbtuit.pythonanywhere.com/api/v1/common/room-list/${selectedFloor}/`)
                .then(response => {
                    setRooms(response.data);
                })
                .catch(error => {
                    console.error('Error fetching rooms:', error);
                });
        }
    }, [selectedFloor]);

    useEffect(() => {
        if (selectedRoom) {
            axios.get(`https://nbtuit.pythonanywhere.com/api/v1/auth/students/${selectedRoom}/?group=${selectedGroup}`) // Updated URL
                .then(response => setStudents(response.data))
                .catch(error => console.error('Error fetching students:', error));

            axios.get(`https://nbtuit.pythonanywhere.com/api/v1/common/attendance/date/`)
                .then(response => {
                    const attendanceData: { student: string; id: string; }[] = response.data; // Adjust type according to your API response
                    const newAttendanceIdMap: Record<string, string> = {};
                    attendanceData.forEach((item) => {
                        newAttendanceIdMap[item.student] = item.id;
                    });
                    setAttendanceIdMap(newAttendanceIdMap);
                })
                .catch(error => console.error('Error fetching attendance IDs:', error));
        }
    }, [selectedRoom, selectedGroup, setStudents]);


    useEffect(() => {
        if (selectedFloorForApartment) {
            axios.get(`https://nbtuit.pythonanywhere.com/api/v1/common/room-list/${selectedFloorForApartment}/`)
                .then(response => {
                    setRoomsForApartment(response.data);
                })
                .catch(error => {
                    console.error('Error fetching rooms for apartment:', error);
                });
        }
    }, [selectedFloorForApartment]);

    const handlePreviousRoom = () => {
        const currentIndex = rooms.findIndex(room => room.id === selectedRoom);
        if (currentIndex > 0) {
            setSelectedRoom(rooms[currentIndex - 1].id);
        }
    };

    const handleNextRoom = () => {
        const currentIndex = rooms.findIndex(room => room.id === selectedRoom);
        if (currentIndex < rooms.length - 1) {
            setSelectedRoom(rooms[currentIndex + 1].id);
        }
    };

    const handleAttendanceChange = (studentId: any) => {
        setSelectedStudent(studentId);
        setModalOpen(true);
    };

    const handleAttendanceSelect = (studentId: any, value: boolean | null) => {
        const key = `${selectedFloor}-${selectedRoom}-${studentId}`;
        const updatedAttendance = { ...attendance, [key]: value };

        const newAttendance = {
            group: selectedGroup,
            student: studentId,
            is_available: value,
            apartment: selectedRoom,
            student_name: students.find(student => student.id === studentId)?.first_name,
            room_name: rooms.find(room => room.id === selectedRoom)?.name,
        };
        console.log(newAttendance);

        const attendanceId = attendanceIdMap[studentId];
        if (attendanceId) {
            axios.patch(`https://nbtuit.pythonanywhere.com/api/v1/common/attendance/${attendanceId}/`, newAttendance)
                .then(() => {
                    setAttendance(updatedAttendance);
                    localStorage.setItem('attendance', JSON.stringify(updatedAttendance));
                    setModalOpen(false);
                })
                .catch(error => console.error('Error updating attendance:', error));
        } else {
            console.error('Attendance ID not found for student:', studentId);
        }
    };

    const handleAttendanceText = (studentId: any) => {
        const key = `${selectedFloor}-${selectedRoom}-${studentId}`;
        if (attendance[key] === false) {
            return <CloseOutlined style={{ color: 'red' }} />;
        } else if (attendance[key] === true) {
            return <CheckOutlined style={{ color: 'green' }} />;
        } else if (attendance[key] === null) {
            return <LockOutlined />;
        }
        return <div style={{ width: '20px', height: '20px', border: '2px solid gray' }} />;
    };

    const handleAddStudentModalOpen = () => {
        setAddStudentModalOpen(true);
    };
    const handleAddTalabaRoomModalOpen = () => {
        setAddTalabaRoomModalOpen(true);
    };
    const handleAddTalabaRoomModalClose = () => {
        setAddTalabaRoomModalOpen(false);
        setPhone('');
        setPassword('');
        setFirstName('');
        setApartment('');
        setSelectedGroup('')
    };
    const handleAddStudentModalClose = () => {
        setAddStudentModalOpen(false);
        setPhone('');
        setPassword('');
        setFirstName('');
        setApartment('');
        setSelectedGroup('');
        setSelectedFloorForApartment('');
        setRoomsForApartment([]);
    };

    const handleAddStudentRoomModalOpen = () => {
        setAddStudentRoomModalOpen(true);
    };

    const handleAddStudentRoomModalClose = () => {
        setAddStudentRoomModalOpen(false);
    };
    console.log(group);

    const handleAddStudent = () => {
        const newStudent = { phone, password, first_name: firstName, apartment: selectedRoom, group: selectedGroup }; // Include selectedGroup

        axios.post('https://nbtuit.pythonanywhere.com/api/v1/auth/create/student/', newStudent)
            .then(response => {
                axios.get(`https://nbtuit.pythonanywhere.com/api/v1/auth/students/${selectedRoom}/?group=${selectedGroup}`) // Updated URL
                    .then(response => {
                        setStudents(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching students:', error);
                    });

                handleAddStudentModalClose();
                setAddStudentRoomModalOpen(false);

            })
            .catch(error => {
                console.error('Error creating student:', error);
            });
    };
    const groupMap = group.reduce((acc: { [x: string]: any; }, grp: { id: string | number; name: any; }) => {
        acc[grp.id] = grp.name;
        return acc;
    }, {});
    
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

    return (
        <Box>
            {!selectedFloor && (
                <Box sx={{ display: 'flex', gap: '10px', mt: 0, flexDirection: 'column' }}>
                    <div className='flex justify-end'>
                        <button
                            className='bg-blue-500 w-[300px] p-[13px] text-white font-bold rounded-md'
                            onClick={handleAddStudentModalOpen}
                        >
                            Add student
                        </button>
                    </div>
                    {floors.map(floor => (
                        <Link key={floor.id} onClick={() => setSelectedFloor(floor.id)} className='hover:border-green-500 border-[1px] rounded-md border-white' style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            <Card sx={{ p: '8px 15px' }}>
                                <CardContent sx={{ p: '0 !important' }}>
                                    <Typography sx={{ m: 0 }}>{floor.name}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Box>
            )}
            {selectedFloor && !selectedRoom && (
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" onClick={() => setSelectedFloor(null)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            Yo'qlama
                        </Link>
                        <Typography color="text.primary">{floors.find(floor => floor.id === selectedFloor)?.name}</Typography>
                    </Breadcrumbs>
                    <Box sx={{ display: 'flex', gap: '10px', mt: 4, flexDirection: 'column' }}>
                        {rooms.map(room => (
                            <Link key={room.id} onClick={() => setSelectedRoom(room.id)} className='hover:border-green-500 border-[1px] rounded-md border-white' style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                <Card sx={{ p: '8px 15px' }}>
                                    <CardContent sx={{ p: '0 !important' }}>
                                        <Typography sx={{ m: 0 }}>{room.name}</Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </Box>
                </Box>
            )}
            {selectedFloor && selectedRoom && (
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" onClick={() => { setSelectedRoom(null); setSelectedFloor(null); }} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            Yo'qlama
                        </Link>
                        <Link color="inherit" onClick={() => setSelectedRoom(null)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            {floors.find(floor => floor.id === selectedFloor)?.name}
                        </Link>
                        <Typography color="text.primary">{rooms.find(room => room.id === selectedRoom)?.name}</Typography>
                    </Breadcrumbs>
                    <Box sx={{ display: 'flex', gap: '10px', mt: 4, flexDirection: 'column' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Ism Familya</th>
                                    <th>Telefon raqami</th>
                                    <th>Guruhi</th>
                                    <th>Kunlikni O'zgartirish</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.id}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td className='text-center'>{student.first_name}</td>
                                        <td className='text-center'>{student.phone}</td>
                                        <td className='text-center'>{groupMap[student.group]}</td> {/* Display group name */}
                                        <td className='text-center'>
                                            <Button
                                                className='ml-[10px] w-[20px] h-[20px] border-2 border-gray-300'
                                                onClick={() => handleAttendanceChange(student.id)}
                                                style={{ display: 'inline-block' }}
                                            >
                                                {handleAttendanceText(student.id)}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button variant="contained" color="primary" onClick={handlePreviousRoom} startIcon={<LeftOutlined />} disabled={!selectedRoom || rooms.findIndex(room => room.id === selectedRoom) === 0}>
                            Oldingi Xona
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleNextRoom} endIcon={<RightOutlined />} disabled={!selectedRoom || rooms.findIndex(room => room.id === selectedRoom) === rooms.length - 1}>
                            Keyingi Xona
                        </Button>
                    </Box>
                    <div className='flex justify-between mt-1'>
                        <Box>
                            <Button variant="contained" color="primary" onClick={handleAddTalabaRoomModalOpen}>Add Student</Button>
                        </Box>
                    </div>
                </Box>
            )}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Select Attendance
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
                        <Button variant="contained" color="primary" onClick={() => handleAttendanceSelect(selectedStudent, true)} startIcon={<CheckOutlined />}>
                            Bor
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleAttendanceSelect(selectedStudent, false)} startIcon={<CloseOutlined />}>
                            Yo'q
                        </Button>
                        <Button variant="outlined" onClick={() => handleAttendanceSelect(selectedStudent, null)}>Cancel</Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={addStudentModalOpen} onClose={handleAddStudentModalClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Add Student
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField type='tel' maxRows={13} label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
                        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                        <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id="group-label-add-student">Guruhni tanlang</InputLabel>
                            <Select
                                labelId="group-label-add-student"
                                id="group-select-add-student"
                                value={selectedGroup}
                                onChange={e => setSelectedGroup(e.target.value)}
                                label="Guruhni tanlang"
                            >
                                {group.map((item:any) => (
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button onClick={handleAddStudentRoomModalOpen}>Select Room</Button>
                        <Typography variant="subtitle1">
                            Selected Room: {rooms.find(room => room.id === selectedRoom)?.name}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleAddStudent} disabled={!phone || !password || !firstName || !selectedRoom || students.length >= 6}>
                            Add Student
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={addStudentRoomModalOpen} onClose={handleAddStudentRoomModalClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Select Room
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="floor-select-label">Select Floor</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={selectedFloorForApartment}
                                label="Select Floor"
                                onChange={(e) => setSelectedFloorForApartment(e.target.value)}
                            >
                                {floors.map(floor => (
                                    <MenuItem key={floor.id}>
                                        {floor.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            {roomsForApartment.map(room => (
                                <Button key={room.id} variant={selectedRoom === room.id ? 'contained' : 'outlined'} onClick={() => setSelectedRoom(room.id)}>
                                    {room.name}
                                </Button>
                            ))}
                        </Box>
                        <Button variant="contained" color="primary" onClick={handleAddStudentRoomModalClose} sx={{ mt: 2 }}>
                            Done
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={addTalabaRoomModalOpen}
                onClose={handleAddTalabaRoomModalClose}
                aria-labelledby="add-student-room-modal-title"
                aria-describedby="add-student-room-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Add New Student
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Phone"
                            name="phone"
                            type="tel"
                            maxRows={13}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id="group-label-add-student">Guruhni tanlang</InputLabel>
                            <Select
                                labelId="group-label-add-student"
                                id="group-select-add-student"
                                value={selectedGroup}
                                onChange={e => setSelectedGroup(e.target.value)}
                                label="Guruhni tanlang"
                            >
                                {group.map((item:any) => (
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button disabled={!phone || !password || !firstName || !selectedRoom || students.length >= 6} variant="contained" color="primary" onClick={handleAddStudent}>Add Student</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};
export default Attendance;