namespace FurnaView.Api.Models;

// The floor is XZ in metres; Y is vertical. Anchors are shared objects when endpoints connect.
public sealed class Anchor(double x, double z)
{
    public Guid Id { get; } = Guid.NewGuid();
    public double X { get; set; } = x;
    public double Z { get; set; } = z;
}

public sealed class Wall(Guid id, string name, Anchor start, Anchor end, double height, double thickness, double tiltDegrees)
{
    public Guid Id { get; } = id;
    public string Name { get; set; } = name;
    public Anchor Start { get; set; } = start;
    public Anchor End { get; set; } = end;
    public double Height { get; set; } = height;
    public double Thickness { get; set; } = thickness;
    public double TiltDegrees { get; set; } = tiltDegrees;
    public double Length => Math.Sqrt(Math.Pow(End.X - Start.X, 2) + Math.Pow(End.Z - Start.Z, 2));
}
