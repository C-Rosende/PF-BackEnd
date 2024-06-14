//userController.js
const User = require('../dao/models/user');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Error obteniendo usuarios');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Error obteniendo el usuario');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).send('Error actualizando el usuario');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).send('Usuario eliminado');
    } catch (error) {
        res.status(500).send('Error eliminando el usuario');
    }
};