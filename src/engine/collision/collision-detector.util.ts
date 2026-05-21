interface Point {
    x: number;
    y: number;
}

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Circle {
    x: number;
    y: number;
    radius: number;
}

export function pointInRect(point: Point, rect: Rect): boolean {
    return (
        point.x >= rect.x
        && point.x <= rect.x + rect.width
        && point.y >= rect.y
        && point.y <= rect.y + rect.height
    );
}

export function rectsOverlap(a: Rect, b: Rect): boolean {
    return (
        a.x < b.x + b.width
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y
    );
}

export function circleInRect(circle: Circle, rect: Rect): boolean {
    const closest_x = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closest_y = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const distance_x = circle.x - closest_x;
    const distance_y = circle.y - closest_y;
    return distance_x * distance_x + distance_y * distance_y <= circle.radius * circle.radius;
}

export function distanceBetween(a: Point, b: Point): number {
    const distance_x = a.x - b.x;
    const distance_y = a.y - b.y;
    return Math.sqrt(distance_x * distance_x + distance_y * distance_y);
}
