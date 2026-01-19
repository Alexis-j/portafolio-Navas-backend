import { findAdminByEmail } from './models/admin.js';

const test = async () => {
  const admin = await findAdminByEmail('admin1@example.com');
};

test();
