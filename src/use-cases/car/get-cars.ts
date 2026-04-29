/* eslint-disable @typescript-eslint/no-explicit-any */
export class GetCarsUseCase {
  constructor(private getCarsRepository: any) {
    this.getCarsRepository = getCarsRepository;
  }
  async execute() {
    const cars = await this.getCarsRepository.execute();

    return cars;
  }
}
