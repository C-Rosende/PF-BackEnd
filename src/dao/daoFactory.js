//daoFactory.js
const ProductManagerDB = require('./productManagerDB');
const ProductManager = require('./productManager');
const CartManagerDB = require('./cartManagerDB');
const CartManager = require('./cartManager');

class DAOFactory {
    static getDAO(daoType) {
        switch (daoType) {
            case 'db':
                return {
                    productDAO: new ProductManagerDB(),
                    cartDAO: new CartManagerDB()
                };
            case 'file':
                return {
                    productDAO: new ProductManager(),
                    cartDAO: new CartManager()
                };
            default:
                throw new Error('DAO type not supported');
        }
    }
}

module.exports = DAOFactory;