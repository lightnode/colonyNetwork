/*
  This file is part of The Colony Network.

  The Colony Network is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  The Colony Network is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with The Colony Network. If not, see <http://www.gnu.org/licenses/>.
*/

pragma solidity >=0.5.3;

import "../lib/dappsys/roles.sol";


contract DomainRoles is DSRoles {
  mapping(address=>mapping(uint256=>bytes32)) _user_roles;

  // New function signatures taking arbitrary domains

  function getUserRoles(address who, uint256 where) public view returns (bytes32) {
    bytes32 globalRoles = getUserRoles(who);
    bytes32 domainRoles = _user_roles[who][where];
    bytes32 result = globalRoles | domainRoles;
    return result;
  }

  function setUserRole(address who, uint256 where, uint8 role, bool enabled) public auth {
    bytes32 last_roles = _user_roles[who][where];
    bytes32 shifted = bytes32(uint256(uint256(2) ** uint256(role)));
    if (enabled) {
      _user_roles[who][where] = last_roles | shifted;
    } else {
      _user_roles[who][where] = last_roles & BITNOT(shifted);
    }
  }

  function hasUserRole(address who, uint256 where, uint8 role) public view returns (bool) {
    bytes32 roles = getUserRoles(who, where);
    bytes32 shifted = bytes32(uint256(uint256(2) ** uint256(role)));
    return bytes32(0) != roles & shifted;
  }

  function canCall(address caller, uint256 where, address code, bytes4 sig) public view returns (bool) {
    bytes32 has_roles = getUserRoles(caller, where);
    bytes32 needs_one_of = getCapabilityRoles(code, sig);
    return bytes32(0) != has_roles & needs_one_of;
  }

  function canCallBecause(address caller, uint256 where, uint8 role, address code, bytes4 sig) public view returns (bool) {
    bytes32 has_roles = getUserRoles(caller, where);
    bytes32 needs_one_of = getCapabilityRoles(code, sig);
    bytes32 shifted = bytes32(uint256(uint256(2) ** uint256(role)));
    // See if the permission comes from a *specific* role
    return bytes32(0) == (needs_one_of & has_roles) ^ shifted;
  }
}
