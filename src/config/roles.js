const roles = ['suadmin', 'org' ,'orgAdmin'];
const adminRoles = ['suadmin', 'org' ,'orgAdmin']; //only this roles can login to dashboard
const superAdminRole = "suadmin"
const roleRights = new Map();
roleRights.set(roles[0], ['getAdmin', "manageAdmin", 'manageUsers','manageOrgAdmin']);
roleRights.set(roles[1], ['getOrg', 'manageOrg', 'manageUsers',]);
roleRights.set(roles[2], ['getOrg', 'manageOrg', 'manageUsers', 'manageOrgAdmin']);
module.exports = {
  roles,
  roleRights,
  adminRoles,
  superAdminRole
};
