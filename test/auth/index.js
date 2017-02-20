
export default () => {
    process.env.JWT_SECRET = 'testingtoken';
    process.env.JWT_EXPIRY = 300;
    console.log( 'Initialized auth token' );
};
