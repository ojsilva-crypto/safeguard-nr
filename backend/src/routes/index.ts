import { Router } from 'express'
import { login } from '../controllers/authController'
import { getDashboard } from '../controllers/dashboardController'
import { list as listRiscos, create as createRisco, remove as removeRisco } from '../controllers/riscosController'
import { list as listPgr, create as createPgr } from '../controllers/pgrController'
import { list as listColaboradores, create as createColaborador } from '../controllers/colaboradoresController'
import { list as listCompliance, create as createCompliance } from '../controllers/complianceController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

// Auth (público)
router.post('/auth/login', login)

// Protegidos
router.use(authMiddleware)

router.get('/dashboard', getDashboard)

router.get('/riscos', listRiscos)
router.post('/riscos', createRisco)
router.delete('/riscos/:id', removeRisco)

router.get('/pgr', listPgr)
router.post('/pgr', createPgr)

router.get('/colaboradores', listColaboradores)
router.post('/colaboradores', createColaborador)

router.get('/compliance', listCompliance)
router.post('/compliance', createCompliance)

export default router
