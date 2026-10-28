import { IGameTableRulesRepository } from '../../../domain/irepositories/IGameTableRulesRepository'

export class ApplyGameSkillEffectUseCase {
  constructor(private repo: IGameTableRulesRepository) {}
  async execute(character_id: string, skill_id: string) {
    return await this.repo.applyGameSkillEffect(character_id, skill_id)
  }
}