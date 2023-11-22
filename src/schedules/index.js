// Packages
import Agenda from 'agenda'
import mongoose from 'mongoose'

class AgendaController {
    instance = null

    init() {
        this.instance = new Agenda()

        return this.instance.mongo(mongoose.connection.db, 'agenda-jobs')
    }
}

const agendaController = new AgendaController()

export default agendaController
