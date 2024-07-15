import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import { CheckOutlined, CloseOutlined, UnlockOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment, { Moment } from 'moment';

interface AttendanceRecord {
  student: any,
  student_name: string;
  date: string;
  is_available: boolean | null;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateMonthDays = (date: string): string[] => {
  const [year, month] = date.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`);
  return daysArray;
};

const AttendanceRecords: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState<string>(formatDate(new Date()));
  const [monthDays, setMonthDays] = useState<string[]>(generateMonthDays(formatDate(new Date())));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AttendanceRecord[]>(`https://nbtuit.pythonanywhere.com/api/v1/common/attendance/date/`);
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchData();
  }, [date]);

  useEffect(() => {
    setMonthDays(generateMonthDays(date));
  }, [date]);

  const handleDateChange = (date: Moment | null, dateString: string | string[]) => {
    if (date) {
      setDate(formatDate(date.toDate()));
    }
  };

  return (
    <div>
      <DatePicker onChange={handleDateChange} picker="month" />
      <table className='mt-[20px]'>
        <thead>
          <tr>
            <th>O'quvchilar</th>
            {monthDays.map(day => (
              <th key={day}>{day.split('-')[2]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((record, index) => (
              <tr key={index}>
                <td className='h-[35px] p-3'>{record.student_name}</td>
                {monthDays.map(day => {
                  const filteredRecords = attendanceData.filter(data => data.date === day && data.student_name === record.student_name && data.is_available === record.is_available);
                  const key = `${day}-${record.student_name}`; 
                  const attendanceRecord = filteredRecords.length > 0 ? filteredRecords[0] : { is_available: null };
                  return (
                    <td className='text-center px-[11px]' key={key}>
                      {attendanceRecord.is_available === true ? (
                        <CheckOutlined style={{ color: 'green' }} />
                      ) : attendanceRecord.is_available === false ? (
                        <CloseOutlined style={{ color: 'red' }} />
                      ) : (
                        <UnlockOutlined />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={monthDays.length + 2}>Bu oyda malumotlar yo'q</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceRecords;
