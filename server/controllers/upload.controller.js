export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Aucun fichier uploadé" });
    }
    
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, url: fileUrl, data: { url: fileUrl, id: req.file.filename } });
};


export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Aucun fichier uploadé" });
    }
    
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, data: { url: fileUrl, id: req.file.filename } });
};
