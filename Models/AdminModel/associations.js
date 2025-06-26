// models/associations.js
import CabDetails from '../AdminModel/CabModel.js';
import Driver from '../AdminModel/DriverModel.js';
import Guide from '../AdminModel/GuideModel.js';
import CabAssignment from '../AdminModel/CabAssignmentModel.js';

export default function setupAssociations() {
    CabAssignment.belongsTo(CabDetails, { foreignKey: 'cabId', as: 'cab' });
    CabDetails.hasMany(CabAssignment, { foreignKey: 'cabId' });

    CabAssignment.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });
    Driver.hasMany(CabAssignment, { foreignKey: 'driverId' });

    CabAssignment.belongsTo(Guide, { foreignKey: 'guideId', as: 'guide' });
    Guide.hasMany(CabAssignment, { foreignKey: 'guideId' });
}





