import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import multer from 'multer';


// database
type FileUpload = {
    filename: string;
    originalFilename: string;
    userId: number;
    downloadCode: string;
    downloadExpiresAt: Date;
};
const db: FileUpload[] = [];
if (fs.existsSync('./uploads')) {
    fs.rmSync('./uploads', { recursive: true });
}
fs.mkdirSync('./uploads');


const MAX_FILES_PER_USER = 3;

// server
const app = express();

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, './uploads'),
        filename: (req, file, cb) => cb(null, uuidv4()),
    })
});

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(500).send({ error: 'Error uploading file' });
        }
        next();
    });
};

const generateDownloadUrl = (code: string) => `http://localhost:3000/download/${code}`;

app.post('/upload', uploadFile, async (req: Request, res: Response) => {
    const userId = +req.headers.authorization; // expect userId
    if (Number.isNaN(userId)) {
        return res.status(403).send({ message: 'Missing authorization' });
    }

    const downloadCode = uuidv4();
    const downloadExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    const files = db.filter(entry => entry.userId === userId);
    if (files.length >= MAX_FILES_PER_USER) {
        return res.status(400).send({ message: 'User already reached maximum number of files' });
    }

    console.log(Object.keys(req));
    // fs.writeFileSync(`./uploads/${filename}`, req.body);
    db.push({
        filename: req.file.filename,
        originalFilename: req.file.originalname,
        userId,
        downloadCode,
        downloadExpiresAt
    });

    return res.status(201).json({ message: 'File uploaded successfully!', downloadUrl: generateDownloadUrl(downloadCode) });
});

app.get('/download/:downloadCode', async (req: Request, res: Response) => {
    const downloadCode = req.params.downloadCode;

    const entry = db
        .filter(entry => entry.downloadCode === downloadCode)
        .filter(entry => entry.downloadExpiresAt.getTime() > new Date().getTime())[0];
    if (entry === undefined) {
        return res.status(404).send({ message: 'Code expired or not found' });
    }

    res.status(200).download(`./uploads/${entry.filename}`, entry.originalFilename);
});

app.get('/db', async (req: Request, res: Response) => {
    res.status(200).json(db);
});

// regenerate download code for a file
app.get('/generateCode/:filename', async (req: Request, res: Response) => {
    const userId = +req.headers.authorization; // expect userId
    if (Number.isNaN(userId)) {
        return res.status(403).send({ message: 'Missing authorization' });
    }

    const filename = req.params.filename;
    const entry = db.filter(entry => entry.filename === filename)[0];
    if (entry === undefined) {
        return res.status(404).send({ message: 'File not found' });
    }

    if (entry.userId !== userId) {
        return res.status(401).send({ message: 'User is not the owner of this file' });
    }

    // we have the reference to the entry
    entry.downloadCode = uuidv4();
    entry.downloadExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    res.status(200).json({
        downloadUrl: generateDownloadUrl(entry.downloadCode)
    });
});

app.get('/listFiles', async (req: Request, res: Response) => {
    const userId = +req.headers.authorization; // expect userId
    if (Number.isNaN(userId)) {
        return res.status(403).send({ message: 'Missing authorization' });
    }

    res.status(200).json(db.filter(entry => entry.userId === userId));
});

app.get('/db', async (req: Request, res: Response) => {
    res.status(200).json(db);
});

app.listen(3000, () => console.log('listening on port 3000'));