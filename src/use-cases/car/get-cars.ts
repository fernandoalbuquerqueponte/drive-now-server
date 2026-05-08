/* eslint-disable @typescript-eslint/no-explicit-any */
export class GetCarsUseCase {
  constructor(private getCarsRepository: any) {
    this.getCarsRepository = getCarsRepository;
  }
  async execute(filters?: any) {
    const cars = await this.getCarsRepository.execute(filters);

    return cars;
  }
}
