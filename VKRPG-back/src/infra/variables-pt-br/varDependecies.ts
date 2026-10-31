import * as skillsIds from './MainUUIDIds/uuidSkills'

type SeedModifierGameTableSkillsDependecies = {
    id: string,
    origin_skill_id: string,
    depends_on_skill_id: string | null,
    depends_on_skill_value: string | null,
    depends_type: string | null
}

export const  modifierGameTableSkillsDependecies: SeedModifierGameTableSkillsDependecies[] = [
    // Falconry (Falcoaria) → Animal Training (Adestramento de Animais)
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillFalconryId,
        depends_on_skill_id: skillsIds.skillAnimalTrainingId,
        depends_on_skill_value: null,
        depends_type: null
    },
    // Lance (Lança de Justa) → Riding (Cavalgar)
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillLanceId,
        depends_on_skill_id: skillsIds.skillRidingId,
        depends_on_skill_value: null,
        depends_type: null
    },
    // Surgery (Cirurgia) → Medicine (Medicina)
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillSurgeryId,
        depends_on_skill_id: skillsIds.skillMedicineId,
        depends_on_skill_value: null,
        depends_type: null
    },
    // Biochemistry (Bioquímica) → Chemistry (Química)
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillBiochemistryId,
        depends_on_skill_id: skillsIds.skillChemistryId,
        depends_on_skill_value: null,
        depends_type: null
    },
    // Computer Programming (Programação de Computadores) → Computer Operation (Operação de Computadores)
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillComputerProgrammingId,
        depends_on_skill_id: skillsIds.skillComputerOperationId,
        depends_on_skill_value: null,
        depends_type: null
    },
    // Electronics (Eletrônica) → Mathematics (Matemática)
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillElectronicsId,
        depends_on_skill_id: skillsIds.skillMathematicsId,
        depends_on_skill_value: null,
        depends_type: null
    },
    // Engineering Mechanical (Engenharia Mecânica) → Mathematics (Matemática)
    {
        id: crypto.randomUUID(),
        origin_skill_id: skillsIds.skillEngineeringMechanicalId,
        depends_on_skill_id: skillsIds.skillMathematicsId,
        depends_on_skill_value: null,
        depends_type: null
    }
]