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
    const [group, setGroup] = useState(''); // New state variable for group

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
            axios.get(`https://nbtuit.pythonanywhere.com/api/v1/auth/students/${selectedRoom}/?group=${group}`) // Updated URL
                .then(response => setStudents(response.data))
                .catch(error => console.error('Error fetching students:', error));

            axios.get(`https://nbtuit.pythonanywhere.com/api/v1/common/attendance/date/`)
                .then(response => {
                    const attendanceData = response.data;
                    const newAttendanceIdMap = {};
                    attendanceData.forEach((item: any) => {
                        newAttendanceIdMap[item.student] = item.id;
                    });
                    setAttendanceIdMap(newAttendanceIdMap);
                })
                .catch(error => console.error('Error fetching attendance IDs:', error));
        }
    }, [selectedRoom, group, setStudents]);

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
        setGroup('');
    };
    const handleAddStudentModalClose = () => {
        setAddStudentModalOpen(false);
        setPhone('');
        setPassword('');
        setFirstName('');
        setApartment('');
        setGroup('');
        setSelectedFloorForApartment('');
        setRoomsForApartment([]);
    };

    const handleAddStudentRoomModalOpen = () => {
        setAddStudentRoomModalOpen(true);
    };

    const handleAddStudentRoomModalClose = () => {
        setAddStudentRoomModalOpen(false);
    };

    const handleAddStudent = () => {
        const newStudent = { phone, password, first_name: firstName, apartment: selectedRoom, group }; // Include group

        axios.post('https://nbtuit.pythonanywhere.com/api/v1/auth/create/student/', newStudent)
            .then(response => {
                axios.get(`https://nbtuit.pythonanywhere.com/api/v1/auth/students/${selectedRoom}/?group=${group}`) // Updated URL
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
                    <Typography variant="h5">Select a Floor</Typography>
                    <Box sx={{ display: 'flex', gap: '10px', mt: 0 }}>
                        {floors.map((floor) => (
                            <Button key={floor.id} onClick={() => setSelectedFloor(floor.id)}>
                                {floor.name}
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}

            {selectedFloor && !selectedRoom && (
                <Box sx={{ display: 'flex', gap: '10px', mt: 2, flexDirection: 'column' }}>
                    <Typography variant="h5">Select a Room</Typography>
                    <Box sx={{ display: 'flex', gap: '10px', mt: 0 }}>
                        {rooms.map((room) => (
                            <Button key={room.id} onClick={() => setSelectedRoom(room.id)}>
                                {room.name}
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}

            {selectedRoom && (
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" onClick={() => setSelectedFloor(null)}>
                            Floors
                        </Link>
                        <Link underline="hover" color="inherit" onClick={() => setSelectedRoom(null)}>
                            Rooms
                        </Link>
                        <Typography color="text.primary">Students</Typography>
                    </Breadcrumbs>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Button onClick={handlePreviousRoom}>
                            <LeftOutlined />
                        </Button>
                        <Typography variant="h5" sx={{ textAlign: 'center' }}>
                            {rooms.find(room => room.id === selectedRoom)?.name}
                        </Typography>
                        <Button onClick={handleNextRoom}>
                            <RightOutlined />
                        </Button>
                    </Box>

                    <Button onClick={handleAddStudentRoomModalOpen} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Add Student to Room
                    </Button>
                    <Modal
                        open={addStudentRoomModalOpen}
                        onClose={handleAddStudentRoomModalClose}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <Box sx={modalStyle}>
                            <Typography id="modal-title" variant="h6" component="h2">
                                Add New Student
                            </Typography>
                            <TextField
                                label="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                type="password"
                            />
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Apartment"
                                value={selectedRoom}
                                disabled
                                fullWidth
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="group-label">Group</InputLabel>
                                <Select
                                    labelId="group-label"
                                    value={group}
                                    onChange={(e) => setGroup(e.target.value)}
                                >
                                    {/* Assuming you have a predefined list of groups */}
                                    <MenuItem value="A">Group A</MenuItem>
                                    <MenuItem value="B">Group B</MenuItem>
                                    <MenuItem value="C">Group C</MenuItem>
                                </Select>
                            </FormControl>
                            <Button onClick={handleAddStudent} variant="contained" color="primary" fullWidth>
                                Add Student
                            </Button>
                        </Box>
                    </Modal>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        {students.map(student => (
                            <Card key={student.id} onClick={() => handleAttendanceChange(student.id)} sx={{ cursor: 'pointer' }}>
                                <CardContent>
                                    <Typography variant="h6">{student.first_name}</Typography>
                                    <Typography variant="body2">{handleAttendanceText(student.id)}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="attendance-modal-title"
                aria-describedby="attendance-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="attendance-modal-title" variant="h6" component="h2">
                        Attendance
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAttendanceSelect(selectedStudent, true)}
                        >
                            Present <CheckOutlined />
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleAttendanceSelect(selectedStudent, false)}
                        >
                            Absent <CloseOutlined />
                        </Button>
                        <Button
                            variant="contained"
                            color="default"
                            onClick={() => handleAttendanceSelect(selectedStudent, null)}
                        >
                            Locked <LockOutlined />
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Attendance;
