const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found.' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'User ID required.' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `No employee matches ID ${req.body.id}.` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

module.exports = {
    getAllUsers,
    deleteUser
}