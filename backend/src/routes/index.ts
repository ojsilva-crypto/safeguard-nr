import { Router } from 'express'
import { authController }           from '../controllers/authController'
import { dashboardController }      from '../controllers/dashboardController'
import { riscosController }         from '../controllers/riscosController'
import { pgrController }            from '../controllers/pgrController'
import { colaboradoresController }  from '../controllers/colaboradoresController'
import { complianceController }     from '../controllers/complianceController'
import { authMiddleware }           from '../middlewares/auth'

const router = Router()

// Auth (público)
router.post('/auth/login', authController.login)

// Protegido
router.use(authMiddleware)

router.get('/auth/me', authController.me)

// Dashboard
router.get('/dashboard', dashboardController.index)

// Riscos
router.get('/riscos',         riscosController.index)
router.get('/riscos/:id',     riscosController.show)
router.post('/riscos',        riscosController.create)
router.put('/riscos/:id',     riscosController.update)
router.delete('/riscos/:id',  riscosController.destroy)

// PGR
router.get('/pgr',        pgrController.index)
router.get('/pgr/:id',    pgrController.show)
router.post('/pgr',       pgrController.create)
router.put('/pgr/:id',    pgrController.update)
router.delete('/pgr/:id', pgrController.destroy)

// Colaboradores
router.get('/colaboradores',        colaboradoresController.index)
router.get('/colaboradores/:id',    colaboradoresController.show)
router.post('/colaboradores',       colaboradoresController.create)
router.put('/colaboradores/:id',    colaboradoresController.update)
router.delete('/colaboradores/:id', colaboradoresController.destroy)

// Compliance
router.get('/compliance',         complianceController.index)
router.patch('/compliance/:id',   complianceController.updateStatus)

export { router }

