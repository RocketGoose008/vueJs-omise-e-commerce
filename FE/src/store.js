import { createStore } from 'vuex';
import Swal from 'sweetalert2';

const store = createStore({
  state() {
    return {
      user: null, // เก็บข้อมูลผู้ใช้
      tasks: JSON.parse(localStorage.getItem('tasks')) || [] // โหลดข้อมูลจาก localStorage
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user; // อัปเดตข้อมูลผู้ใช้
    },
    setTasks(state, tasks) {
      state.tasks = tasks; // อัปเดตรายการงาน
    },
    addTask(state, task) {
      state.tasks.push(task); // เพิ่มงานใหม่
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTask(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask); // อัปเดตงานที่ถูกแก้ไขใน state
      }
    },
    deleteTask(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(state.tasks)); // อัพเดตข้อมูลลง localStorage
    }
  },
  actions: {
    fetchTasks({ commit }) {
      // ฟังก์ชันนี้ใช้ดึงข้อมูลจาก API
      fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(data => {
          commit('setTasks', data); // บันทึกข้อมูลที่ได้รับจาก API ลงใน state
        })
        .catch(error => {
          console.error('Error fetching tasks:', error); // แสดงข้อผิดพลาด
        });
    },
    async deleteTaskWithConfirmation({ commit }, taskId) {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบเลย!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        // ถ้ายืนยันให้ลบงานจาก state
        commit('deleteTask', taskId);
        Swal.fire('ลบแล้ว!', 'งานของคุณถูกลบเรียบร้อยแล้ว', 'success');
      }
    }
  },
  getters: {
    getUser(state) {
      return state.user; // ดึงข้อมูลผู้ใช้
    },
    getTasks(state) {
      return state.tasks; // ดึงข้อมูลรายการงาน
    }
  },
});

export default store;
