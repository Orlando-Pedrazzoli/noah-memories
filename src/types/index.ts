// src/types/index.ts
// =============================================================================

export interface Memory {
  _id?: string;
  title: string;
  description: string;
  images: string[];
  ageCategory:
    | '0-12meses'
    | '1ano'
    | '2anos'
    | '3anos'
    | '4anos'
    | '5anos'
    | '6anos'
    | '7anos'
    | '8anos'
    | '9anos'
    | '10anos';
  type: 'memory' | 'schoolwork';
  createdAt: Date;
  updatedAt: Date;
}

export interface Travel {
  _id?: string;
  title: string;
  description: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
  };
  images: string[];
  dateVisited: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: string;
  username: string;
  password: string;
}
