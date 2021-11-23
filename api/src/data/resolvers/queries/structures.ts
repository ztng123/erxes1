import { Departments, Units, Users } from '../../../db/models';
import { Branches, Structures } from '../../../db/models/Structure';

const structureQueries = {
  departments(
    _root,
    { depthType, searchValue }: { depthType?: string; searchValue?: string }
  ) {
    const filter: { parentId?: any; $or?: any[] } = {};

    if (depthType === 'parent') {
      filter.parentId = null;
    } else if (depthType === 'children') {
      filter.parentId = { $ne: null };
    }

    if (searchValue) {
      const regexOption = {
        $regex: `.*${searchValue.trim()}.*`,
        $options: 'i'
      };

      filter.$or = [
        {
          title: regexOption
        },
        {
          description: regexOption
        }
      ];
    }

    return Departments.find(filter).sort({ title: 1 });
  },

  departmentDetail(_root, { _id }) {
    return Departments.getDepartment({ _id });
  },

  units(_root, { searchValue }: { searchValue?: string }) {
    const filter: { $or?: any[] } = {};

    if (searchValue) {
      const regexOption = {
        $regex: `.*${searchValue.trim()}.*`,
        $options: 'i'
      };

      filter.$or = [
        {
          title: regexOption
        },
        {
          description: regexOption
        }
      ];
    }

    return Units.find(filter).sort({ title: 1 });
  },

  unitDetail(_root, { _id }) {
    return Units.getUnit({ _id });
  },

  branches(
    _root,
    { depthType, searchValue }: { depthType?: string; searchValue?: string }
  ) {
    const filter: { parentId?: any; $or?: any[] } = {};

    if (depthType === 'parent') {
      filter.parentId = null;
    }

    if (searchValue) {
      const regexOption = {
        $regex: `.*${searchValue.trim()}.*`,
        $options: 'i'
      };

      filter.$or = [
        {
          title: regexOption
        },
        {
          address: regexOption
        }
      ];
    }

    return Branches.find(filter).sort({ title: 1 });
  },

  branchDetail(_root, { _id }) {
    return Branches.getBranch({ _id });
  },

  async noDepartmentUsers(_root, { excludeId }) {
    const userIds: string[] = [];

    const filter: { _id?: { $ne: string } } = {};

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const departments = await Departments.find(filter);

    departments.forEach(d => {
      if (d.supervisorId) {
        userIds.push(d.supervisorId);
      }

      if (d.userIds && d.userIds.length > 0) {
        userIds.push(...d.userIds);
      }
    });

    return Users.find({ _id: { $nin: userIds }, isActive: true });
  },

  structureDetail() {
    return Structures.findOne();
  }
};

export default structureQueries;
