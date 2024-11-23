let assignments = []; // Mock database

// Get all assignments
exports.getAssignments = (req, res) => {
    res.status(200).json(assignments);
};

// Add a new assignment
exports.addAssignment = (req, res) => {
    const { title, description, deadline } = req.body;
    const newAssignment = { id: Date.now(), title, description, deadline };
    assignments.push(newAssignment);
    res.status(201).json(newAssignment);
};

// Edit an existing assignment
exports.editAssignment = (req, res) => {
    const { id } = req.params;
    const { title, description, deadline } = req.body;

    const assignment = assignments.find(ass => ass.id == id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    assignment.title = title;
    assignment.description = description;
    assignment.deadline = deadline;

    res.status(200).json(assignment);
};

// Delete an assignment
exports.deleteAssignment = (req, res) => {
    const { id } = req.params;
    assignments = assignments.filter(ass => ass.id != id);
    res.status(200).json({ message: 'Assignment deleted successfully' });
};
