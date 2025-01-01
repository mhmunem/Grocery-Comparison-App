import app from './app';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
