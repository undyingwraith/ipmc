export const IProfileServiceConfigurationSymbol = Symbol.for('IProfileServiceConfiguration');

export interface IProfileServiceConfiguration {
	profileFile: string;
}

export const DefaultProfileServiceConfiguration: IProfileServiceConfiguration = {
	profileFile: './profile.json',
};
