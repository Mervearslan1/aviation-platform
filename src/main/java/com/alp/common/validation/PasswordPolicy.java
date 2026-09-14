package com.alp.common.validation;

import com.alp.common.exception.ApiException;

import java.util.regex.Pattern;

public final class PasswordPolicy {

    private static final Pattern UPPER = Pattern.compile("[A-Z]");
    private static final Pattern LOWER = Pattern.compile("[a-z]");
    private static final Pattern DIGIT = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL = Pattern.compile("[^A-Za-z0-9]");

    public static final int MIN_LENGTH = 8;
    public static final int MAX_LENGTH = 72;

    private PasswordPolicy() {
    }

    public static void validate(String password) {
        if (password == null
                || password.length() < MIN_LENGTH
                || password.length() > MAX_LENGTH
                || !UPPER.matcher(password).find()
                || !LOWER.matcher(password).find()
                || !DIGIT.matcher(password).find()
                || !SPECIAL.matcher(password).find()) {
            throw ApiException.badRequest(
                    "Password must be 8-72 characters and include uppercase, lowercase, digit, and special character"
            );
        }
    }
}
