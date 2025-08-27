const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Rule = require("../models/Rules");
const Question = require("../models/Questions");
const User = require("../models/User");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --------------------------------------------------------------------------------------------------------------

// Rules File

const expectedHeaders = ["event", "title", "points", "subpoints[0]", "subpoints[1]", "subpoints[2]"];

router.post("/uploadrules", upload.single("file"), async (req, res) => {

	try {

		if (!req.file) return res.status(400).send("No file uploaded");
		const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

		const uploadedHeaders = data[0].map(h => h?.toString().trim());
		const isHeaderValid = JSON.stringify(uploadedHeaders) === JSON.stringify(expectedHeaders);

		if (!isHeaderValid) {
			return res.status(400).json({ error: "Header mismatch", expected: expectedHeaders, got: uploadedHeaders });
		}

		const rows = data.slice(1);

		const rulesData = rows.map(row => ({
			event: row[0] || "",
			title: row[1] || "",
			points: row[2] || "",
			subpoints: [row[3] || "", row[4] || "", row[5] || ""].filter(Boolean)
		}));

		await Rule.insertMany(rulesData);
		res.json({ message: "Rules uploaded successfully", count: rulesData.length });

	} catch (err) {
		console.error('Error in uploading Rules File : ',err);
		res.status(500).send("Server Error");
	}
})

// --------------------------------------------------------------------------------------------------------------

// Question File Upload

router.post("/uploadquestion", upload.single("file"), async (req, res) => {

	try {

		if (!req.file) return res.status(400).send("No file uploaded");
		const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const rows = xlsx.utils.sheet_to_json(sheet);

		const questions = rows.map(row => ({
			event: row.event,
			questionNo: row.questionNo,
			question: row.question,
			questionType: row.questionType,
			options: [
				row["options[0]"],
				row["options[1]"],
				row["options[2]"],
				row["options[3]"]
			].filter(opt => opt !== undefined && opt !== ""),
			answer: row.questionType === "image" ? null : row.answer,
			mark: row.mark
		}));

		await Question.insertMany(questions);
		res.json({ message: "Questions uploaded successfully", count: questions.length });

	} catch (err) {
		console.error('Error in uploading Question File : ',err);
		res.status(500).send("Error uploading questions");
	}
})

// --------------------------------------------------------------------------------------------------------------

// Participants File Upload

const userHeaders = ["event","teamId", "password", "role", "participants[0]", "participants[1]", "contactNo", "deptName", "clgName"];

router.post("/uploadusers", upload.single("file"), async (req, res) => {

	try {

		if (!req.file) return res.status(400).send("No file uploaded");
		const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

		const uploadedHeaders = data[0].map(h => h?.toString().trim());
		const isHeaderValid = JSON.stringify(uploadedHeaders) === JSON.stringify(userHeaders);

		if (!isHeaderValid) {
			return res.status(400).json({ error: "Header mismatch", expected: userHeaders, got: uploadedHeaders });
		}

		const rows = data.slice(1);

		const userData = rows.map(row => ({
			event: row[0] || "",
			teamId: row[1] || "",
			password: row[2] || "",
			role: row[3] || "",
			participants: [row[4] || "", row[5] || ""],
			contactNo: row[6] || "",
			deptName: row[7] || "",
			clgName: row[8] || "",
		}))

		await User.insertMany(userData);
		res.json({ message: "User uploaded successfully", count: userData.length });

	} catch (err) {
		console.error('Error in uploading Users File : ',err);
		res.status(500).send("Server Error");
	}
})

// --------------------------------------------------------------------------------------------------------------

module.exports = router;