package lab.paint.paint.api;


public class Save {
    private String ID;
    private double posx;
    private double posy;
    private String colourfill;
    private double w;
    private double h;
    private String shapeType;
    private double rotation;

    public Save() {
    }

    public Save(String ID, double posx, double posy, String colourfill, double w, double h, String shapeType, double rotation) {
        this.ID = ID;
        this.posx = posx;
        this.posy = posy;
        this.colourfill = colourfill;
        this.w = w;
        this.h = h;
        this.shapeType = shapeType;
        this.rotation = rotation;
    }

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public double getPosx() {
        return posx;
    }

    public void setPosx(double posx) {
        this.posx = posx;
    }

    public double getPosy() {
        return posy;
    }

    public void setPosy(double posy) {
        this.posy = posy;
    }

    public String getColourfill() {
        return colourfill;
    }

    public void setColourfill(String colourfill) {
        this.colourfill = colourfill;
    }

    public double getW() {
        return w;
    }

    public void setW(double w) {
        this.w = w;
    }

    public double getH() {
        return h;
    }

    public void setH(double h) {
        this.h = h;
    }

    public String getShapeType() {
        return shapeType;
    }

    public void setShapeType(String shapeType) {
        this.shapeType = shapeType;
    }

    public double getRotation() {
        return rotation;
    }

    public void setRotation(double rotation) {
        this.rotation = rotation;
    }
}
