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

router.post("/uploadrules", upload.single("file"), async (req, res) => {

	try {

		if (!req.file) return res.status(400).send("No file uploaded");

		const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

		if (!data.length) return res.status(400).json({ error: "Excel is empty" });

		const uploadedHeaders = data[0].map(h => h?.toString().trim());
		const baseHeaders = ["event", "title", "points"];
		const subpointHeaders = uploadedHeaders.slice(3);

		const isBaseValid = JSON.stringify(uploadedHeaders.slice(0, 3)) === JSON.stringify(baseHeaders);
		const areSubpointsValid = subpointHeaders.every(h => /^subpoints\[\d+\]$/.test(h));

		if (!isBaseValid || !areSubpointsValid) {
			return res.status(400).json({
				error: "Header mismatch",
				expected: "event, title, points, subpoints[n]",
				got: uploadedHeaders
			});
		}

		const rows = data.slice(1);
		const rulesData = rows.map(row => {
			const subpoints = row.slice(3).filter(Boolean);
			return {
				event: row[0] || "",
				title: row[1] || "",
				points: row[2] || "",
				subpoints
			};
		});

		if (!rulesData.length) return res.status(400).json({ error: "No data found" });
		await Rule.insertMany(rulesData);
		res.json({ message: "Rules uploaded successfully", count: rulesData.length });

	} catch (err) {
		console.error('Error uploading Rules file:', err);
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
		console.error('Error in uploading Question File : ', err);
		res.status(500).send("Error uploading questions");
	}
})

// --------------------------------------------------------------------------------------------------------------

// Participants File Upload

const userBaseHeaders = ["event", "teamId", "password", "role", "contactNo", "deptName", "clgName"];

router.post("/uploadusers", upload.single("file"), async (req, res) => {

	try {

		if (!req.file) return res.status(400).send("No file uploaded");

		const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

		if (!data.length) return res.status(400).json({ error: "Excel is empty" });

		const uploadedHeaders = data[0].map(h => h?.toString().trim());

		const participantHeadersStart = 4;
		const participantHeadersEnd = uploadedHeaders.length - userBaseHeaders.length + participantHeadersStart;

		const participantHeaders = uploadedHeaders.slice(participantHeadersStart, participantHeadersEnd);
		const otherHeaders = [
			...uploadedHeaders.slice(0, participantHeadersStart),
			...uploadedHeaders.slice(participantHeadersEnd)
		];

		const areParticipantHeadersValid = participantHeaders.every(h => /^participants\[\d+\]$/.test(h));
		const areOtherHeadersValid = JSON.stringify(otherHeaders) === JSON.stringify(userBaseHeaders);

		if (!areParticipantHeadersValid || !areOtherHeadersValid) {
			return res.status(400).json({
				error: "Header mismatch",
				expected: "event, teamId, password, role, participants[n], contactNo, deptName, clgName",
				got: uploadedHeaders
			});
		}

		const rows = data.slice(1);

		const userData = rows.map(row => {
			const participants = row.slice(participantHeadersStart, participantHeadersEnd).filter(Boolean);
			return {
				event: row[0] || "", teamId: row[1] || "",
				password: row[2] || "", role: row[3] || "",
				participants,
				contactNo: row[participantHeadersEnd] || "",
				deptName: row[participantHeadersEnd + 1] || "",
				clgName: row[participantHeadersEnd + 2] || "",
			};
		});

		await User.insertMany(userData);
		res.json({ message: "Users uploaded successfully", count: userData.length });

	} catch (err) {
		console.error('Error in uploading Users file:', err);
		res.status(500).send("Server Error");
	}
});


// --------------------------------------------------------------------------------------------------------------

module.exports = router;