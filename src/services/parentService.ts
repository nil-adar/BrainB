
import { Parent, Student } from "@/types/school";
import { mockParents } from "./mock/parents";
import { mockStudents } from "./mock/students";

export const parentService = {
  getAllParents: async () => {
    return new Promise<Parent[]>((resolve) => {
      setTimeout(() => resolve(mockParents), 500);
    });
  },

  getParent: async (id: string) => {
    return new Promise<Parent | undefined>((resolve) => {
      setTimeout(() => {
        const parent = mockParents.find(p => p.id === id);
        if (parent) {
          const children = mockStudents.filter(s => parent.childrenIds.includes(s.id));
          resolve({ ...parent, children });
        } else {
          resolve(undefined);
        }
      }, 500);
    });
  },

  getStudentParents: async (studentId: string) => {
    return new Promise<Parent[]>((resolve) => {
      setTimeout(() => {
        const student = mockStudents.find(s => s.id === studentId);
        if (!student) {
          resolve([]);
          return;
        }
        const parents = mockParents.filter(p => student.parentIds.includes(p.id));
        resolve(parents);
      }, 500);
    });
  },

  getParentChildren: async (parentId: string) => {
    return new Promise<Student[]>((resolve) => {
      setTimeout(() => {
        const parent = mockParents.find(p => p.id === parentId);
        if (!parent) {
          resolve([]);
          return;
        }
        const children = mockStudents.filter(s => parent.childrenIds.includes(s.id));
        resolve(children);
      }, 500);
    });
  },

  updateParent: async (parentId: string, updateData: Partial<Parent>) => {
    return new Promise<Parent | null>((resolve) => {
      setTimeout(() => {
        const index = mockParents.findIndex(p => p.id === parentId);
        if (index === -1) {
          resolve(null);
          return;
        }
        mockParents[index] = { ...mockParents[index], ...updateData };
        resolve(mockParents[index]);
      }, 500);
    });
  },

  addParent: async (newParent: Omit<Parent, 'id'>) => {
    return new Promise<Parent>((resolve) => {
      setTimeout(() => {
        const parent = {
          ...newParent,
          id: `p${mockParents.length + 1}`,
        } as Parent;
        mockParents.push(parent);
        resolve(parent);
      }, 500);
    });
  },

  deleteParent: async (parentId: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const initialLength = mockParents.length;
        const index = mockParents.findIndex(p => p.id === parentId);
        if (index > -1) {
          mockParents.splice(index, 1);
        }
        resolve(mockParents.length < initialLength);
      }, 500);
    });
  }
};
