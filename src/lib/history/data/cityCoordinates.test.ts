import { describe, it, expect } from 'vitest';
import { chinaCityCoordinates, getCitiesWithCoordinates, type CityCoordinate } from './cityCoordinates';

describe('cityCoordinates', () => {
  describe('chinaCityCoordinates', () => {
    it('should be a non-empty object', () => {
      expect(chinaCityCoordinates).toBeDefined();
      expect(Object.keys(chinaCityCoordinates).length).toBeGreaterThan(0);
    });

    it('should contain all expected major cities', () => {
      const expectedMajorCities = [
        '北京', '上海', '广州', '深圳', '成都', '重庆', '武汉', '南京', '杭州', '西安',
        '郑州', '长沙', '昆明', '沈阳', '哈尔滨', '长春', '大连', '青岛', '济南', '天津',
        '苏州', '合肥', '福州', '厦门', '南昌', '石家庄', '保定', '唐山', '太原', '兰州',
        '贵阳', '拉萨', '西宁', '银川', '乌鲁木齐', '呼和浩特', '海口', '南宁', '桂林',
      ];
      expectedMajorCities.forEach(city => {
        expect(chinaCityCoordinates).toHaveProperty(city);
      });
    });

    it('each city should have name and coordinates', () => {
      Object.entries(chinaCityCoordinates).forEach(([key, city]) => {
        expect(city).toHaveProperty('name');
        expect(city).toHaveProperty('coordinates');
        expect(city.name).toBe(key);
        expect(city.coordinates).toBeInstanceOf(Array);
        expect(city.coordinates).toHaveLength(2);
      });
    });

    it('coordinates should be valid [longitude, latitude] pairs', () => {
      // China geographic bounds: longitude 73-135, latitude 18-54
      Object.entries(chinaCityCoordinates).forEach(([key, city]) => {
        const [lng, lat] = city.coordinates;
        expect(lng).toBeGreaterThanOrEqual(73);
        expect(lng).toBeLessThanOrEqual(135);
        expect(lat).toBeGreaterThanOrEqual(18);
        expect(lat).toBeLessThanOrEqual(54);
      });
    });

    it('should not contain duplicate city names', () => {
      const cityNames = Object.values(chinaCityCoordinates).map(c => c.name);
      const uniqueNames = new Set(cityNames);
      expect(uniqueNames.size).toBe(cityNames.length);
    });

    it('capital cities should have plausible coordinates', () => {
      // Beijing
      expect(chinaCityCoordinates['北京'].coordinates[0]).toBeCloseTo(116.4, 1);
      expect(chinaCityCoordinates['北京'].coordinates[1]).toBeCloseTo(39.9, 1);
      // Shanghai
      expect(chinaCityCoordinates['上海'].coordinates[0]).toBeCloseTo(121.5, 1);
      expect(chinaCityCoordinates['上海'].coordinates[1]).toBeCloseTo(31.2, 1);
      // Guangzhou
      expect(chinaCityCoordinates['广州'].coordinates[0]).toBeCloseTo(113.3, 1);
      expect(chinaCityCoordinates['广州'].coordinates[1]).toBeCloseTo(23.1, 1);
    });
  });

  describe('getCitiesWithCoordinates', () => {
    it('should return an array', () => {
      const result = getCitiesWithCoordinates();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return all city keys', () => {
      const result = getCitiesWithCoordinates();
      const expectedKeys = Object.keys(chinaCityCoordinates).sort();
      expect(result.sort()).toEqual(expectedKeys);
    });

    it('should return unique city names', () => {
      const result = getCitiesWithCoordinates();
      const unique = new Set(result);
      expect(unique.size).toBe(result.length);
    });

    it('should include major cities', () => {
      const result = getCitiesWithCoordinates();
      expect(result).toContain('北京');
      expect(result).toContain('上海');
      expect(result).toContain('广州');
      expect(result).toContain('深圳');
      expect(result).toContain('成都');
      expect(result).toContain('重庆');
    });
  });

  describe('CityCoordinate interface', () => {
    it('should have correct structure for a sample city', () => {
      const beijing = chinaCityCoordinates['北京'] as CityCoordinate;
      expect(beijing.name).toBe('北京');
      expect(beijing.coordinates).toEqual([116.4, 39.9]);
    });
  });
});
