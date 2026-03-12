import { MockMethod } from 'vite-plugin-mock'
import info from './api/info'
import policyCheck from './api/policy-check'
import history from './api/history'
export default [info, history, policyCheck] as MockMethod[]
