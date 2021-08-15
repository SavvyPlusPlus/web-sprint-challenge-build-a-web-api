// Write your "projects" router here!
const express = require('express');
const Project = require('./projects-model.js');
const { validateProjectId, validateProject } = require('./projects-middleware.js')
const router = express.Router();

//GET
router.get('/', async (req, res, next) => {
    try {
        const p = await Project.get()
        res.status(200).json(p)
    } catch (err) {
        next(err)
    }
})

//GET BY ID
router.get('/:id', validateProjectId, (req, res) => {
    Project.get(req.params.id)
        .then(project => {
            if (project) {
                console.log(project)
                res.status(200).json(project);
            } else (
                res.status(404).json({ message: "The project with the specified ID does not exist" })
            )
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "The project information could not be retrieved",
            });
        });
})

//POST PROJECT
router.post('/', validateProject, (req, res) => {
    const newProject = req.body
    if (!newProject.name || !newProject.description) {
        res.status(400).json({ message: "Please provide a name and description for new project" })
    } else {
        Project.insert(newProject)
            .then(project => {
                console.log("New Project created", project)
                res.status(201).json(project)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    message: "There was an error while saving the project to the database",
                });
            });
    }
})

//CREAT PROJECT
router.put('/:id', validateProjectId, validateProject, async (req, res) => {
    const changes = req.body
    const { id } = req.params
    try {
        if (!changes.name || !changes.description) {
            res.status(400).json({ message: "Please provide a name and description for the project" })
        } else {
            const updatedProject = await Project.update(id, changes)
            if (!updatedProject) {
                res.status(404).json({ message: "The project with the specified ID does not exist" })
            } else {
                console.log('Project updated!')
                res.status(200).json(updatedProject)
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "The project information could not be modified" })
    }
})

//DELETE PROJECT

router.delete('/:id', validateProjectId, async (req, res) => {
    try {
        const { id } = req.params
        const deletedProject = await Project.remove(id)
        if (!deletedProject) {
            res.status(404).json({ message: "The project with the specified ID does not exist" })
        } else {
            console.log('Project deleted!')
            res.status(200).json(deletedProject)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "The project could not be removed" })
    }
})

//DUEL
router.get('/:id/actions', validateProjectId, (req, res) => {
    Project.getProjectActions(req.params.id)
        .then(project => {
            if (project) {
                console.log('Project Actions:', project)
                res.status(200).json(project);
            } else (
                res.status(404).json({ message: "The project with the specified ID does not exist" }))
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "The project actions could not be retrieved",
            });
        })
})

module.exports = router