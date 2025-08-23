const UserModel = require('../models/User')
const SettingModel = require('../models/Settings')

// --------------------------------------------------------------------------------------------------------------

// Fetch Status of Allow Test in Admin Setting Menu

const testAccessFetch = async (req, res) => {

    const { event } = req.body;

    try {
        const testPermission = await SettingModel.findOne({ event })
        // console.log(testPermission)
        return res.status(200).json({ status: 200, allowTest: testPermission.allowTest, time: testPermission.time })
    } catch (error) {
        console.error('Error in fetching status access : ', error);
        return res.status(500).json({ message: 'Error in fetching status access' });
    }

}

// --------------------------------------------------------------------------------------------------------------

// Test Access Save in Admin Setting Menu

const testAccessSave = async (req, res) => {

    const { allowTest, event, time } = req.body;
    // console.log(req.body)

    try {
        await SettingModel.findOneAndUpdate({ event }, { allowTest, time }, { new: true })
        return res.status(200).json({ status: 200, message: 'Settings Saved Sucessfully' })
    } catch (error) {
        console.error('Error in saving test access : ', error);
        return res.status(500).json({ message: 'Error in saving test access' });
    }
}

module.exports = { testAccessSave, testAccessFetch }